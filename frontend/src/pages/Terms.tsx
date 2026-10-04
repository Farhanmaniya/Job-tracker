import './Legal.css'

function Terms() {
    return (
        <div className="legal-page">
            <h1>Terms & Conditions</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <p>
                Job Tracker is a personal tool for tracking job applications. It is provided as-is, with no guarantee of uptime or data durability.
            </p>

            <p>
                You are responsible for the accuracy of the information you enter. Do not use this tool to store sensitive information beyond what is needed to track your own job search.
            </p>

            <p>
                This project may change or be discontinued at any time without notice.
            </p>
        </div>
    );
}

export default Terms;