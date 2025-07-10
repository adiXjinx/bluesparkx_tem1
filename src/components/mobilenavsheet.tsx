// "use client"

// import Link from "next/link"

// export default function MobileNavSheet({ user }: { user: any }) {
//   // You can pass more props (like profile/avatar) if you want
//   return (
//     <div className="flex flex-col space-y-2 p-6">
//       <Link href="/" className="hover:text-primary py-2 text-lg font-semibold tracking-tight">
//         BlueSparkx
//       </Link>
//       {user && (
//         <>
//           <Link href="/private" className="hover:text-primary py-2 text-base font-medium">
//             Private
//           </Link>
//           <Link href="/pro" className="hover:text-primary py-2 text-base font-medium">
//             Pro
//           </Link>
//           <Link href="/hobby" className="hover:text-primary py-2 text-base font-medium">
//             Hobby
//           </Link>
//           <Link href="/subscription" className="hover:text-primary py-2 text-base font-medium">
//             Subscription
//           </Link>
//         </>
//       )}
//       {!user && (
//         <>
//           <Link href="/auth/login" className="hover:text-primary py-2 text-base font-medium">
//             Login
//           </Link>
//           <Link href="/auth/signup" className="hover:text-primary py-2 text-base font-medium">
//             Sign Up
//           </Link>
//         </>
//       )}
//     </div>
//   )
// }
