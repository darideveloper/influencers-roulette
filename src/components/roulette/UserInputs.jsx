export default function UserInputs({ username, email, onUsernameChange, onEmailChange }) {
  return (
    <div className="max-w-md mx-auto mb-4">
      <input 
        type="text" 
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        placeholder="Nombre de usuario" 
        className="input w-full mb-3 bg-white text-gray-800 rounded-full px-6 py-3 text-center shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-white/50"
      />
      
      <input 
        type="email" 
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        placeholder="Correo Electronico" 
        className="input w-full bg-white text-gray-800 rounded-full px-6 py-3 text-center shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-white/50"
      />
    </div>
  );
}

