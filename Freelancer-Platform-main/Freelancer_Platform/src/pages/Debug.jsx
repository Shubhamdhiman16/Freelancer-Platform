// Debug component to diagnose blank page issues
export default function Debug() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Debug Info</h1>
      <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'}</p>
      <p><strong>Auth Token:</strong> {localStorage.getItem('authToken') ? '✓ Found' : '✗ Not found'}</p>

      <h3>Testing API Connection...</h3>
      <button
        onClick={async () => {
          try {
            const response = await fetch('http://localhost:5001/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken') || 'test'}`,
                'Content-Type': 'application/json'
              }
            });
            alert(`Response: ${response.status} ${response.statusText}`);
            const data = await response.json();
            alert(JSON.stringify(data, null, 2));
          } catch (error) {
            alert(`Error: ${error.message}\n\nMake sure backend is running on http://localhost:5001`);
          }
        }}
        style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}
      >
        Test Backend Connection
      </button>

      <h3>Environment Variables:</h3>
      <pre>{JSON.stringify({
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        MODE: import.meta.env.MODE,
        DEV: import.meta.env.DEV,
        PROD: import.meta.env.PROD,
      }, null, 2)}</pre>

      <p style={{marginTop: '20px', color: '#666'}}>
        Open browser Console (F12) to see more detailed errors
      </p>
    </div>
  );
}
