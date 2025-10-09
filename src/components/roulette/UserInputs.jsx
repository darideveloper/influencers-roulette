export default function UserInputs({ username, email, onUsernameChange, onEmailChange }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      <label className="form-control w-full mb-3">
        <div className="label">
          <span className="label-text">Username</span>
        </div>
        <input 
          type="text" 
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="👤 Enter your username" 
          className="input input-bordered w-full"
        />
      </label>
      
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Email</span>
        </div>
        <input 
          type="email" 
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="📧 Enter your email" 
          className="input input-bordered w-full"
        />
      </label>
    </div>
  );
}

