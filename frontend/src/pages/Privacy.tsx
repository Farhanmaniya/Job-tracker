import "./Legal.css"

function Privacy() {
    return(
        <div className="legal-page">
            <h1>Privacy Policy</h1>
            <p>Last Updated: {new Date().toLocaleDateString()}</p>

            <p>
                Job Tracker stores the information you enter: your name, email and the job applications you add (company, role, status, dates, and any notes). This data is used only to show you your own applications when you log in.
            </p>

            <p>
                Your password is never stored in plain text. It is hashed before being saved.
            </p>

            <p>
                Your data is not shared with, or sold to, any third party. It is stored in a database connected to this application and is only accessible to you through your account.
            </p>

            <p>
                You can request deletion of your account and all associated data by contacting the site owner.
            </p>
        </div>
    );
}

export default Privacy;