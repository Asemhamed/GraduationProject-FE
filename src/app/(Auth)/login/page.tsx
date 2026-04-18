'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUserData } from '@/Context/UserData'
import { setToken } from '@/Cookies/auth.actions'
import { LoginSchema, LoginType } from '@/Schema/AuthScheema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Award, BarChart3, BookOpen, Eye, EyeOff, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Bounce, toast } from 'react-toastify'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {setToken:setTokenContext}=useUserData()
  const router = useRouter();


  const {register,handleSubmit,reset,setError,formState}=useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues:{
      email:'',
      password:''
    },
    mode:'onSubmit'
  });


  async function onSubmit(data:LoginType){
  setIsLoading(true);
    try{
      const res = await fetch('',{
        method:'post',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
      });
      const result =await res.json();
            if (res.ok && result.message === "success") {
        toast.success('Account logged in successfully!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
}); 
        setTokenContext('result.token');
        await setToken(result.token);
        reset();

        setTimeout(() => {
          router.push("/");
        }, 2000);

    }else{
      throw new Error(result.message || "Login failed");
    }
}catch(err:any){
      setError('password',{message:err.message || "Invalid email or password"});
    }finally{
      setIsLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background overflow-hidden">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/30 rounded-full blur-3xl"></div>

        <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-primary/20 to-transparent"></div>
        <div className="absolute bottom-1/3 right-20 w-px h-24 bg-gradient-to-b from-transparent to-primary/20"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full items-center">

          <div className="hidden lg:flex flex-col justify-center items-center lg:items-start space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-600/40 rounded-2xl backdrop-blur-xl ">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Faculty Portal
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Manage courses, students, and academic resources with a centralized platform designed for modern education.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8 w-full max-w-md">
              <div className="p-4 rounded-xl bg-card/50  backdrop-blur-sm ">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-cyan-600/20 ">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">50+</div>
                </div>
                <p className="text-sm text-muted-foreground">Active Courses</p>
              </div>
              <div className="p-4 rounded-xl bg-card/50  backdrop-blur-sm ">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-cyan-600/20 ">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">5K+</div>
                </div>
                <p className="text-sm text-muted-foreground">Students Enrolled</p>
              </div>
              <div className="p-4 rounded-xl bg-card/50  backdrop-blur-sm ">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-cyan-600/20 ">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">95%</div>
                </div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
              <div className="p-4 rounded-xl bg-card/50  backdrop-blur-sm ">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-cyan-600/20 ">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">4+</div>
                </div>
                <p className="text-sm text-muted-foreground">Departments</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-md border-border/60 bg-card shadow-lg">
              <CardHeader className="space-y-2 pb-6">
                <CardTitle className="text-3xl font-bold text-foreground">
                  Faculty Login
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Enter your institutional credentials to access the faculty portal
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Institutional Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="faculty@university.edu"
                      className={`bg-white  text-foreground placeholder:text-muted-foreground   h-11 rounded-lg transition-all ${
                        formState.errors.email ? "border-red-500 bg-red-50/30" : "border-gray-200"
                      }`}
                    />
                    {formState.errors.email && <p className="text-red-600">{formState.errors.email.message}</p>}
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-foreground font-medium">
                        Password
                      </Label>
                      <a
                        href="#"
                        className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        placeholder="••••••••••••"
                        className={`bg-white  text-foreground placeholder:text-muted-foreground h-11 rounded-lg pr-10 transition-all ${
                        formState.errors.password ? "border-red-500 bg-red-50/30" : "border-gray-200"
                      }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>

                      {formState.errors.password && <p className="text-red-600">{formState.errors.password.message}</p>}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cursor-pointer h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-8"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Logging in...
                      </>
                    ) : (
                      <>
                        Login
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <a href="#" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                      Sign up here
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
