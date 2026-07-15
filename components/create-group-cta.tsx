// "use client"
// import CreateGroupButton from "./create-group-button"

// export default function CreateGroupCTA() {
//   return (
//     <div className="flex flex-col items-center justify-center py-16 text-center">
//       <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-3xl mb-4">
//         👥
//       </div>
//       <h3 className="text-base font-semibold text-white/80 mb-2">No groups yet</h3>
//       <p className="text-sm text-white/35 max-w-xs leading-relaxed mb-6">
//         Create a group to start splitting expenses with friends, family, or roommates.
//       </p>
//       <CreateGroupButton label="Create your first group" />
//     </div>
//   )
// }
"use client"
import CreateGroupButton from "./create-group-button"

export default function CreateGroupCTA() {
  return <CreateGroupButton label="Create your first group" />
}