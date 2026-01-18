
export interface ErrorLogEntry {
    status: number;         // 401, 403, etc.
    endpoint: string;       // "/api/lights"
    message: string;        // "Not authenticated"
    timestamp?: string;     // Optional, UI generated
}

// Scenario for error-log tests
export interface ErrorLogScenario {
    
    description: string;
    initialEntries?: ErrorLogEntry[]; // Existing errors expected when we open the page
    expectedEntries?: ErrorLogEntry[]; // After some action (refresh / clear / cause error)
}
