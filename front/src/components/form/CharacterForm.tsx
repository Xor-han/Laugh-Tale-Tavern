// import { useState } from "react";
// import { X, Upload } from "lucide-react";
// import { uploadImage } from "../api/image.api";
// import type { CreateCharacter } from "../interfaces/onePieceCharacter.interface";
// import {
//   Profession,
//   type ProfessionType,
// } from "../interfaces/profession.interface";


// interface Props {
//   onSubmit: (data: CreateCharacter) => void;
//   onClose: () => void;
// }

// export const CharacterForm = ({ onSubmit, onClose }: Props) => {
//   const [name, setName] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [imagePublicId, setimagePublicId] = useState("");
//   const [isAlive, setIsAlive] = useState(false);
//   const [profession, setProfession] = useState("");
//   const [uploading, setUploading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name.trim() || !imageUrl.trim() || !imagePublicId.trim())
//       onSubmit({
//         name: name.trim(),
//         imageUrl: imageUrl.trim(),
//         imagePublicId: imagePublicId.trim(),
//         isAlive,
//         profession: profession as ProfessionType,
//       });
//   };
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white rounded-2xl p-8 w-full max-w-md flex flex-col gap-6"
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-5 h-5 rounded-full" />
//             <h2 className="text-xl font-semibold">Nouveau personnage</h2>
//           </div>
//           <button
//             type="button"
//             onClick={onClose}
//             className="cursor-pointer text-red-500 hover:text-red-700"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//         <input
//           type="text"
//           placeholder="Nom du personnage"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           maxLength={50}
//           className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-gray-500"
//         />
//          <div className="flex flex-col gap-2">
//         <p className="text-sm font-bold text-gray-700">Image du fruit</p>
//         { ? (
//           <div className="relative h-40 w-full border rounded-2xl overflow-hidden bg-gray-50">
//             <img
//               src={imageUrl}
//               className="h-full w-full object-contain"
//               alt="Preview"
//             />
//             <button
//               type="button"
//               onClick={() => {}}
//               }
//               className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg"
//             >
//               <X size={16} />
//             </button>
//           </div>
//         ) : (
//           <div className="border-2 border-dashed border-gray-200 p-8 flex flex-col items-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all rounded-2xl">
//             <Upload size={24} className="text-gray-400 mb-2" />
//             <span className="text-sm font-medium text-gray-500">
//               {uploading ? "Chargement..." : "Cliquer pour uploader"}
//             </span>
//             <input
//               id="fruitImage"
//               type="file"
//               className="hidden"
//               onChange={handleFileChange}
//               accept="image/*"
//             />
//           </div>
//         )}
//       </div>
//       </form>
//     </div>
//   );
// };
