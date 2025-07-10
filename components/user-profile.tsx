"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { User, Save, Lock, Eye, EyeOff } from "lucide-react"

interface UserProfileProps {
  language: "en" | "th"
  user: { name: string; email: string } | null
}

interface UserData {
  id: number
  name: string
  email: string
  phone: string
  date_of_birth: string
  height: number
  weight: number
  fitness_level: string
  goals: string[]
}

export function ProfileForm({ language, user }: UserProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)

  const fitnessLevels = [
    { value: "beginner", label: language === "th" ? "เริ่มต้น" : "Beginner" },
    { value: "intermediate", label: language === "th" ? "ปานกลาง" : "Intermediate" },
    { value: "advanced", label: language === "th" ? "ขั้นสูง" : "Advanced" }
  ]
  const goalOptions = [
    { value: "weight_loss", label: language === "th" ? "ลดน้ำหนัก" : "Weight Loss" },
    { value: "muscle_gain", label: language === "th" ? "เพิ่มกล้ามเนื้อ" : "Muscle Gain" },
    { value: "endurance", label: language === "th" ? "ความทนทาน" : "Endurance" },
    { value: "strength", label: language === "th" ? "ความแข็งแรง" : "Strength" },
    { value: "flexibility", label: language === "th" ? "ความยืดหยุ่น" : "Flexibility" }
  ]

  useEffect(() => {
    if (user) fetchUserData()
  }, [user])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/user", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setUserData({
          ...data.user,
          date_of_birth: data.user.date_of_birth ? data.user.date_of_birth.substring(0, 10) : "",
          goals: Array.isArray(data.user.goals) ? data.user.goals : [],
        })
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleUpdateProfile = async () => {
    if (!userData) return
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })
      if (response.ok) {
        toast({
          title: language === "th" ? "อัปเดตสำเร็จ" : "Success",
          description: language === "th" ? "ข้อมูลผู้ใช้ได้รับการอัปเดตแล้ว" : "User profile updated successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: language === "th" ? "เกิดข้อผิดพลาด" : "Error",
          description: error.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: language === "th" ? "เกิดข้อผิดพลาด" : "Error",
        description: language === "th" ? "ไม่สามารถอัปเดตข้อมูลได้" : "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoalChange = (goal: string, checked: boolean) => {
    if (!userData) return
    const updatedGoals = checked
      ? [...userData.goals, goal]
      : userData.goals.filter(g => g !== goal)
    setUserData({ ...userData, goals: updatedGoals })
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === "th" ? "กำลังโหลดข้อมูล..." : "Loading profile..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border p-6 md:p-8 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xl font-bold mb-1">
          <User className="w-5 h-5" />
          {language === "th" ? "ข้อมูลส่วนตัว" : "Profile Information"}
        </div>
        <div className="text-muted-foreground text-sm">
          {language === "th" ? "แก้ไขข้อมูลส่วนตัวของคุณ" : "Update your personal information"}
        </div>
      </div>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleUpdateProfile(); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">{language === "th" ? "ชื่อ" : "Name"}</Label>
            <Input id="name" value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="email">{language === "th" ? "อีเมล" : "Email"}</Label>
            <Input id="email" value={userData.email} disabled className="bg-muted" />
          </div>
          <div>
            <Label htmlFor="phone">{language === "th" ? "เบอร์โทรศัพท์" : "Phone"}</Label>
            <Input id="phone" value={userData.phone || ""} onChange={e => setUserData({ ...userData, phone: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="date_of_birth">{language === "th" ? "วันเกิด" : "Date of Birth"}</Label>
            <Input id="date_of_birth" type="date" value={userData.date_of_birth || ""} onChange={e => setUserData({ ...userData, date_of_birth: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="height">{language === "th" ? "ส่วนสูง (ซม.)" : "Height (cm)"}</Label>
            <Input id="height" type="number" value={userData.height || ""} onChange={e => setUserData({ ...userData, height: Number(e.target.value) })} />
          </div>
          <div>
            <Label htmlFor="weight">{language === "th" ? "น้ำหนัก (กก.)" : "Weight (kg)"}</Label>
            <Input id="weight" type="number" value={userData.weight || ""} onChange={e => setUserData({ ...userData, weight: Number(e.target.value) })} />
          </div>
        </div>
        <div>
          <Label htmlFor="fitness_level">{language === "th" ? "ระดับความฟิต" : "Fitness Level"}</Label>
          <Select value={userData.fitness_level || ""} onValueChange={value => setUserData({ ...userData, fitness_level: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fitnessLevels.map(level => (
                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{language === "th" ? "เป้าหมายการออกกำลังกาย" : "Fitness Goals"}</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {goalOptions.map(goal => (
              <div key={goal.value} className="flex items-center space-x-2">
                <Checkbox id={goal.value} checked={userData.goals.includes(goal.value)} onCheckedChange={checked => handleGoalChange(goal.value, checked as boolean)} />
                <Label htmlFor={goal.value} className="text-sm">{goal.label}</Label>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {loading ? (language === "th" ? "กำลังบันทึก..." : "Saving...") : (language === "th" ? "บันทึกข้อมูล" : "Save Profile")}
        </Button>
      </form>
    </div>
  )
}

export function PasswordForm({ language, user }: UserProfileProps) {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: language === "th" ? "รหัสผ่านไม่ตรงกัน" : "Passwords don't match",
        description: language === "th" ? "กรุณาตรวจสอบรหัสผ่านใหม่" : "Please check your new password",
        variant: "destructive"
      })
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })
      if (response.ok) {
        toast({
          title: language === "th" ? "อัปเดตรหัสผ่านสำเร็จ" : "Password Updated",
          description: language === "th" ? "รหัสผ่านได้รับการอัปเดตแล้ว" : "Password updated successfully",
        })
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        const error = await response.json()
        toast({
          title: language === "th" ? "เกิดข้อผิดพลาด" : "Error",
          description: error.error,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: language === "th" ? "เกิดข้อผิดพลาด" : "Error",
        description: language === "th" ? "ไม่สามารถอัปเดตรหัสผ่านได้" : "Failed to update password",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border p-6 md:p-8 shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xl font-bold mb-1">
          <Lock className="w-5 h-5" />
          {language === "th" ? "เปลี่ยนรหัสผ่าน" : "Change Password"}
        </div>
        <div className="text-muted-foreground text-sm">
          {language === "th" ? "อัปเดตรหัสผ่านของคุณ" : "Update your password"}
        </div>
      </div>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleUpdatePassword(); }}>
        <div>
          <Label htmlFor="currentPassword">{language === "th" ? "รหัสผ่านปัจจุบัน" : "Current Password"}</Label>
          <div className="relative">
            <Input id="currentPassword" type={showPassword ? "text" : "password"} value={passwordData.currentPassword} onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
            <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        <div>
          <Label htmlFor="newPassword">{language === "th" ? "รหัสผ่านใหม่" : "New Password"}</Label>
          <Input id="newPassword" type="password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">{language === "th" ? "ยืนยันรหัสผ่านใหม่" : "Confirm New Password"}</Label>
          <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          <Lock className="w-4 h-4 mr-2" />
          {loading ? (language === "th" ? "กำลังอัปเดต..." : "Updating...") : (language === "th" ? "อัปเดตรหัสผ่าน" : "Update Password")}
        </Button>
      </form>
    </div>
  )
} 