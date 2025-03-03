"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "./icons";
import useUpdateProfile from "@/hooks/api/account/useUpdateProfile";
import useChangePassword from "@/hooks/api/account/useChangePassword";
import { useChangeEmail } from "@/hooks/api/account/useChangeEmail";
import useGetProfile from "@/hooks/api/account/useGetProfile"; // New hook for fetching profile
import {
  CheckCircle,
  AlertCircle,
  Camera,
  Mail,
  Lock,
  User,
} from "lucide-react";

const EditProfileForm = () => {
  const { data: session, status } = useSession();
  // Add the profile data from API
  const { data: profileData, isLoading: isProfileLoading } = useGetProfile();

  const { mutate: updateProfile, isPending: isUpdateProfilePending } =
    useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const { mutate: changeEmail, isPending } = useChangeEmail();

  // Display states
  const [displayName, setDisplayName] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");
  const [displayImage, setDisplayImage] = useState("/images/placeholder.png");

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Preview image state
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    // First try to load data from API
    if (profileData?.data) {
      const userData = profileData.data;
      setDisplayName(userData.name || "");
      setDisplayEmail(userData.email || "");
      setDisplayImage(userData.imageUrl || "/images/placeholder.png");
      setFormName(userData.name || "");
      setFormEmail(userData.email || "");
      setIsEmailVerified(userData.isVerified || false);
    }
    // Fallback to session data if API data is not available
    else if (session?.user) {
      setDisplayName(session.user.name || "");
      setDisplayEmail(session.user.email || "");
      setDisplayImage(
        session.user.imageUrl ||
          session.user.image ||
          "/images/placeholder.png",
      );
      setFormName(session.user.name || "");
      setFormEmail(session.user.email || "");
      setIsEmailVerified(session.user.isVerified || false);
    }
  }, [session, profileData]);

  // Show loading state if either session or profile is loading
  if (status === "loading" || isProfileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Keep the original session check
  if (!session && !profileData?.data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
              <h2 className="mt-2 text-xl font-semibold">
                Authentication Required
              </h2>
              <p className="mt-2 text-gray-500">
                Please sign in to access your profile settings.
              </p>
              <Button
                className="mt-4"
                variant="default"
                onClick={() => (window.location.href = "/api/auth/signin")}
              >
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePersonalUpdate = async () => {
    try {
      await updateProfile(
        { name: formName, imageFile },
        {
          onSuccess: () => {
            setDisplayName(formName);
            if (imageFile) {
              const imageUrl = URL.createObjectURL(imageFile);
              setDisplayImage(imageUrl);
              setPreviewImage(null);
            }
            toast({
              title: "Profile Updated",
              description:
                "Your personal information has been updated successfully.",
            });
          },
          onError: (error) => {
            toast({
              title: "Update Failed",
              description:
                "There was a problem updating your profile. Please try again.",
              variant: "destructive",
            });
          },
        },
      );
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all password fields to continue.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate(
      {
        oldPassword: currentPassword,
        newPassword,
        confirmPassword,
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          toast({
            title: "Password Updated",
            description: "Your password has been changed successfully.",
          });
        },
      },
    );
  };

  const handleEmailUpdate = () => {
    changeEmail(
      { email: formEmail },
      {
        onSuccess: () => {
          setDisplayEmail(formEmail);
          setIsEmailVerified(false);
          toast({
            title: "Email Updated",
            description:
              "Please check your inbox to verify your new email address.",
          });
        },
      },
    );
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="overflow-hidden border-none shadow-md">
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600 sm:h-48">
          <div className="absolute -bottom-16 left-6 sm:-bottom-20 sm:left-8">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md sm:h-40 sm:w-40">
                <AvatarImage
                  src={previewImage || displayImage}
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary text-lg text-white sm:text-xl">
                  {displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary/90 sm:bottom-3 sm:right-3 sm:h-10 sm:w-10"
              >
                <Camera size={16} className="sm:size-20" />
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  onChange={handleProfileImageChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </div>

        <CardContent className="mt-16 pt-4 sm:mt-20">
          <div className="mb-2 flex items-center">
            <h2 className="text-xl font-bold sm:text-2xl">{displayName}</h2>
            {isEmailVerified ? (
              <span className="ml-2 inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                <CheckCircle className="mr-1 h-3 w-3" /> Verified
              </span>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">{displayEmail}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 rounded-lg bg-muted/50">
          <TabsTrigger
            value="personal"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <User size={16} />
            <span className="hidden sm:inline">Personal Info</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Lock size={16} />
            <span className="hidden sm:inline">Security</span>
            <span className="sm:hidden">Password</span>
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Mail size={16} />
            <span>Email</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="personal">
            <Card className="border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <CardDescription>
                  Update your profile details and personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="profileImage"
                      className="text-sm font-medium"
                    >
                      Profile Picture
                    </Label>
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={previewImage || displayImage}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Input
                        id="profileImage"
                        type="file"
                        onChange={handleProfileImageChange}
                        accept="image/*"
                        className="flex-1 border-gray-200 text-sm"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          disabled={isUpdateProfilePending}
                          className="mt-2 px-6"
                        >
                          {isUpdateProfilePending && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Save Changes
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Update Profile</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to update your profile
                            information?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-md">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handlePersonalUpdate}
                            className="rounded-md bg-primary font-semibold hover:bg-primary/90"
                          >
                            Update
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Security Settings</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentPassword"
                      className="text-sm font-medium"
                    >
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter your current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-medium"
                    >
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="px-6"
                          disabled={changePasswordMutation.isPending}
                        >
                          {changePasswordMutation.isPending && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Update Password
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Change Password</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to change your password?
                            You'll need to use the new password next time you
                            log in.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-md">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handlePasswordUpdate}
                            className="rounded-md bg-primary font-semibold hover:bg-primary/90"
                          >
                            Update
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card className="border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Email Settings</CardTitle>
                <CardDescription>
                  Update or verify your email address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      {isEmailVerified ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          <CheckCircle className="mr-1 h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                          <AlertCircle className="mr-1 h-3 w-3" /> Pending
                          verification
                        </span>
                      )}
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="flex-1" disabled={isPending}>
                          {isPending && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Update Email
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Update Email</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to update your email address?
                            You will need to verify your new email.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-md">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleEmailUpdate}
                            className="rounded-md bg-primary font-semibold hover:bg-primary/90"
                          >
                            Update
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {!isEmailVerified && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 border-gray-200"
                          >
                            Resend Verification
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Resend Verification Email
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Would you like to resend the verification email to{" "}
                              {formEmail}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-md">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction className="rounded-md bg-primary font-semibold hover:bg-primary/90">
                              Send Email
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  {!isEmailVerified && (
                    <Alert className="mt-4 border-amber-200 bg-amber-50 text-amber-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Verification Required</AlertTitle>
                      <AlertDescription>
                        Please verify your email address to access all features
                        and receive important notifications.
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default EditProfileForm;
