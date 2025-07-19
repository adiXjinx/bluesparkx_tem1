import LandingPage from "@/components/landing-page/landingpage"
import { createClient } from "@/utils/supabase/server"
 // const supabase = await createClient()
  // const { data } = await supabase.auth.getUser()
  // console.log(data)
  // if (data.user) {
  //   const { data: profile } = await supabase.from("profile").select("*").eq("user_id", data.user.id).single()
  //   console.log(profile)
  // }
const Homepage = async () => {
  // const supabase = await createClient()
  // const { data } = await supabase.auth.getUser()
  // console.log(data)
  // if (data.user) {
  //   const { data: profile } = await supabase.from("profile").select("*").eq("user_id", data.user.id).single()
  //   console.log(profile)
  // }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden ">
      {/* Spark Glow */}
      <div
        className="absolute top-1/4 left-1/3 z-0 h-[320px] w-[480px] rounded-full opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, #2b81ff 0%, #0a1026 80%)",
        }}
      />
      <div className="relative z-10 mb-8 text-4xl font-extrabolddrop-shadow-lg">
        BlueSparkx Dark Mode
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          Welcome to <span className="text-blue-400">BlueSparkx</span>
        </h1>
        <p className="max-w-md text-center text-lg sm:text-xl">
          A digital forge where indie SaaS dreams come alive. BlueSparkx is the motherbrand crafting
          bold, powerful tools for tomorrow.
        </p>
        <div className="mt-8 text-sm ">
          🚧 Under construction — testing ground for future sparks.
        </div>
      </div>
      <div className="mt-8">
        <LandingPage />
      </div>
    </div>
    // <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#143e83] px-4 text-white">
    //   <div className="flex flex-col items-center justify-center">
    //     <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
    //       Welcome to <span className="text-blue-400">BlueSparkx</span>
    //     </h1>
    //     <p className="max-w-md text-center text-lg text-gray-300 sm:text-xl">
    //       A digital forge where indie SaaS dreams come alive. BlueSparkx is the motherbrand crafting
    //       bold, powerful tools for tomorrow.
    //     </p>
    //     <div className="mt-8 text-sm text-gray-500">
    //       🚧 Under construction — testing ground for future sparks.
    //     </div>
    //   </div>
    //   <div className="mt-8">
    //     <LandingPage />
    //   </div>
    // </div>
  )
}

export default Homepage

// <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#143e83] px-4 text-white">
//   <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
//     Welcome to <span className="text-blue-400">BlueSparkx</span>
//   </h1>
//   <p className="max-w-md text-center text-lg text-gray-300 sm:text-xl">
//     A digital forge where indie SaaS dreams come alive. BlueSparkx is the motherbrand crafting
//     bold, powerful tools for tomorrow.
//   </p>
//   <div className="mt-8 text-sm text-gray-500">
//     🚧 Under construction — testing ground for future sparks.
//   </div>
// </div>
