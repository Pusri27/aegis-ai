import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

export function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${((ms % 60000) / 1000).toFixed(0)}s`;
}

export function getVerdictColor(verdict: string): string {
    switch (verdict) {
        case 'GO':
            return 'verdict-go';
        case 'NO-GO':
            return 'verdict-no-go';
        case 'CONDITIONAL':
            return 'verdict-conditional';
        default:
            return 'bg-gray-500';
    }
}

export function getStatusColor(status: string): string {
    switch (status) {
        case 'completed':
            return 'badge-success';
        case 'failed':
            return 'badge-error';
        case 'pending':
            return 'badge-info';
        default:
            return 'badge-warning';
    }
}

export function getSeverityColor(severity: string): string {
    switch (severity) {
        case 'critical':
            return 'text-red-500';
        case 'high':
            return 'text-orange-500';
        case 'medium':
            return 'text-yellow-500';
        case 'low':
            return 'text-green-500';
        default:
            return 'text-gray-500';
    }
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

export function getAgentIcon(agentName: string): string {
    if (agentName.includes('Research')) return '🔍';
    if (agentName.includes('Analysis')) return '📊';
    if (agentName.includes('Risk')) return '⚠️';
    if (agentName.includes('Decision')) return '🎯';
    return '🤖';
}

export function getAgentColor(agentName: string): string {
    if (agentName.includes('Research')) return 'from-blue-500 to-cyan-500';
    if (agentName.includes('Analysis')) return 'from-purple-500 to-pink-500';
    if (agentName.includes('Risk')) return 'from-orange-500 to-red-500';
    if (agentName.includes('Decision')) return 'from-green-500 to-emerald-500';
    return 'from-gray-500 to-gray-600';
}
