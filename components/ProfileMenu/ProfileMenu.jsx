// components/ProfileMenu.tsx
export default function ProfileMenu({ user }) {
  return (
    <div
      id="profileMenu"
      className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg hidden z-50"
    >
      <div className="p-4 border-b text-center">
        <img src={user.photo || '/default-avatar.png'} className="w-16 h-16 rounded-full mx-auto" />
        <p className="font-semibold mt-2">{user.prenom} {user.nom}</p>
      </div>
      <ul className="text-sm">
        <li className="p-3 hover:bg-gray-100 cursor-pointer">Edit Profile</li>
        <li className="p-3 hover:bg-gray-100 cursor-pointer">Settings & Privacy</li>
        <li className="p-3 hover:bg-gray-100 cursor-pointer">Help & Support</li>
        <li className="p-3 hover:bg-gray-100 cursor-pointer text-red-500">Logout</li>
      </ul>
    </div>
  );
}
