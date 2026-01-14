import chromadb
from chromadb.config import Settings
import logging
from typing import List, Dict, Any, Optional
from app.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

# Global ChromaDB client
_chroma_client: Optional[chromadb.ClientAPI] = None
_collection: Optional[chromadb.Collection] = None


def init_vector_store():
    """Initialize the ChromaDB vector store."""
    global _chroma_client, _collection
    
    # Use new PersistentClient API
    _chroma_client = chromadb.PersistentClient(
        path=settings.CHROMA_PERSIST_DIR
    )
    
    _collection = _chroma_client.get_or_create_collection(
        name="aegis_memory",
        metadata={"description": "AegisAI long-term memory for insights and experiences"}
    )
    
    logger.info(f"ChromaDB initialized with {_collection.count()} documents")


def get_collection() -> chromadb.Collection:
    """Get the ChromaDB collection."""
    if _collection is None:
        init_vector_store()
    return _collection


def add_memory(
    text: str,
    metadata: Dict[str, Any],
    memory_id: Optional[str] = None
) -> str:
    """Add a memory to the vector store."""
    collection = get_collection()
    
    if memory_id is None:
        import uuid
        memory_id = str(uuid.uuid4())
    
    collection.add(
        documents=[text],
        metadatas=[metadata],
        ids=[memory_id]
    )
    
    logger.info(f"Added memory: {memory_id}")
    return memory_id


def search_similar_memories(
    query: str,
    n_results: int = 5,
    category_filter: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Search for similar memories."""
    collection = get_collection()
    
    where_filter = None
    if category_filter:
        where_filter = {"category": category_filter}
    
    results = collection.query(
        query_texts=[query],
        n_results=n_results,
        where=where_filter
    )
    
    memories = []
    if results and results['documents']:
        for i, doc in enumerate(results['documents'][0]):
            memories.append({
                "id": results['ids'][0][i] if results['ids'] else None,
                "text": doc,
                "metadata": results['metadatas'][0][i] if results['metadatas'] else {},
                "distance": results['distances'][0][i] if results.get('distances') else None
            })
    
    return memories


def update_memory_from_feedback(
    analysis_id: str,
    feedback_data: Dict[str, Any]
) -> None:
    """Update memory based on user feedback."""
    collection = get_collection()
    
    # Create a feedback-based memory entry
    feedback_text = f"""
    Analysis feedback:
    - Rating: {feedback_data.get('rating')}/5
    - Accuracy: {feedback_data.get('accuracy_rating')}/5
    - Decision correct: {feedback_data.get('was_decision_correct')}
    - Missing factors: {feedback_data.get('missing_factors', 'None')}
    - Comment: {feedback_data.get('comment', 'No comment')}
    """
    
    add_memory(
        text=feedback_text,
        metadata={
            "type": "feedback",
            "analysis_id": analysis_id,
            "rating": feedback_data.get('rating', 0),
            "category": "user_feedback"
        }
    )
    
    logger.info(f"Memory updated from feedback for analysis: {analysis_id}")
