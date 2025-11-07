import { useTheme } from "../ThemeContext";

interface RoomCardProps {
  room: {
    name: string;
    devices: number;
    online: number;
    offline: number;
  };
  onClick: () => void;
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  const { darkMode } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left w-full ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <svg
          className="w-12 h-12 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {room.devices}
        </span>
      </div>

      <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {room.name}
      </h3>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {room.online} Online
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {room.offline} Offline
          </span>
        </div>
      </div>

      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <span className="text-blue-600 font-medium flex items-center">
          Ver detalhes
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </button>
  );
}
