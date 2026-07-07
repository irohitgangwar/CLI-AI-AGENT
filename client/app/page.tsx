"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import {
  Terminal as TerminalIcon,
  Bot,
  MessageSquare,
  Wrench,
  ShieldAlert,
  KeyRound,
  Copy,
  Check,
  ExternalLink,
  Cpu,
  Code2,
  LogIn,
  LogOut,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export default function Home() {
  const { data, isPending } = authClient.useSession()
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText("npm install -g orbital-cli-agent")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onError: (ctx) => console.log(ctx),
        onSuccess: () => {
          router.refresh()
        },
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Cpu className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              ORBIT CLI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-100 transition-colors">Features</a>
            <a href="#installation" className="hover:text-zinc-100 transition-colors">Getting Started</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/device")}
              className="border-dashed border-zinc-700 hover:bg-zinc-900 text-zinc-300 font-medium"
            >
              <KeyRound className="w-4 h-4 mr-2 text-indigo-400" />
              Authorize Device
            </Button>

            {isPending ? (
              <Spinner className="w-5 h-5 text-zinc-400" />
            ) : data?.user ? (
              <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-lg">
                <div className="flex items-center gap-2">
                  {data.user.image ? (
                    <img src={data.user.image} alt={data.user.name} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-zinc-400" />
                  )}
                  <span className="text-xs font-semibold text-zinc-300 max-w-[120px] truncate">{data.user.name}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => router.push("/sign-in")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Gemini 2.5 Flash
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          The Autonomous AI Developer <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Inside Your Terminal
          </span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Generate complete projects, search directories, and chat with files directly from your CLI. A lightweight, robust AI companion built for swift development.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <a href="#installation">
            <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/device")}
            className="w-full sm:w-auto border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300"
          >
            Authorize Terminal Code
          </Button>
        </div>
      </section>


      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 border-t border-zinc-900">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Power-Packed CLI Features</h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto font-light">
            An elegant integration of generative AI models directly inside a local developer terminal environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 border border-zinc-800/80 bg-zinc-900/30 rounded-2xl hover:border-indigo-500/30 transition-all hover:bg-zinc-900/50 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Interactive AI Chat</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Start natural chat logs in your console. Streams response tokens in real-time with full markdown code block formatting.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 border border-zinc-800/80 bg-zinc-900/30 rounded-2xl hover:border-indigo-500/30 transition-all hover:bg-zinc-900/50 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Secure Tool Execution</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Permit the AI model to check your folders, read codebase files, execute queries via ripgrep, and build custom test scripts safely.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 border border-zinc-800/80 bg-zinc-900/30 rounded-2xl hover:border-indigo-500/30 transition-all hover:bg-zinc-900/50 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Agentic Code Builder</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Describe a feature or new project, and Orbit designs, creates directory pathways, writes source files, and verifies builds autonomously.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 border border-zinc-800/80 bg-zinc-900/30 rounded-2xl hover:border-indigo-500/30 transition-all hover:bg-zinc-900/50 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <KeyRound className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Device Code Security</h3>
            <p className="text-zinc-400 text-sm font-light leading-relaxed">
              Utilize a secure device flow OAuth. Log in on the browser via GitHub to link the CLI session safely without pasting passwords.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started Guide */}
      <section id="installation" className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-900">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">Getting Started</h2>
          <p className="text-zinc-400 text-sm md:text-base">Follow these steps to run Orbit CLI locally on your computer.</p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4 p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-sm font-bold text-indigo-400 font-mono">
              01
            </div>
            <div className="space-y-3 w-full">
              <h3 className="text-lg font-semibold">Install Package Globally</h3>
              <p className="text-zinc-400 text-sm font-light">Install Orbit directly to your system path using npm:</p>
              <div className="flex items-center justify-between gap-3 bg-zinc-950 p-4 border border-zinc-800 rounded-xl font-mono text-sm">
                <span className="text-emerald-400 overflow-x-auto py-1">npm install -g orbital-cli-agent</span>
                <button
                  onClick={copyToClipboard}
                  className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-zinc-200 shrink-0"
                  title="Copy command"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-sm font-bold text-indigo-400 font-mono">
              02
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Obtain Google Gemini API Key</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Orbit uses Gemini 2.5 Flash models to drive code generation and tooling commands. Visit{" "}
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  Google AI Studio <ExternalLink className="w-3.5 h-3.5" />
                </a>{" "}
                to obtain your free API key.
              </p>
              <p className="text-zinc-400 text-sm font-light">
                In the directories where you want to invoke Orbit CLI, create a file named <code className="font-mono text-indigo-400 bg-zinc-900 px-1.5 py-0.5 rounded text-xs">.env</code> containing:
              </p>
              <pre className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl font-mono text-sm text-zinc-400">
                GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
              </pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-sm font-bold text-indigo-400 font-mono">
              03
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Wake Up & Chat</h3>
              <p className="text-zinc-400 text-sm font-light">
                Run the authorization flow and boot up the assistant using your terminal:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl font-mono text-sm">
                  <p className="text-zinc-500 text-xs mb-1"># Authenticate terminal</p>
                  <p className="text-emerald-400">orbital login</p>
                </div>
                <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl font-mono text-sm">
                  <p className="text-zinc-500 text-xs mb-1"># Open assistant menu</p>
                  <p className="text-emerald-400">orbital wakeup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900/80 bg-zinc-950 py-12 text-center text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/irohitgangwar"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
              </svg> GitHub Profile
            </a>
          </div>
          <p>© {new Date().getFullYear()} Orbit CLI Project. Licensed under the MIT License.</p>
        </div>
      </footer>
    </div>
  )
}