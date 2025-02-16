"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

const EditProfileForm = () => {
  const { data: session, status } = useSession();
  const { mutate: updateProfile, isPending: isUpdateProfilePending } = useUpdateProfile();
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

  useEffect(() => {
    if (session?.user) {
      setDisplayName(session.user.name || "");
      setDisplayEmail(session.user.email || "");
      setDisplayImage(session.user.imageUrl || session.user.image || "/images/placeholder.png");
      setFormName(session.user.name || "");
      setFormEmail(session.user.email || "");
      setIsEmailVerified(session.user.isVerified || false);
    }
  }, [session]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Please sign in</div>;

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
            }
            toast({
              title: "Success",
              description: "Profile updated successfully",
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "Failed to update profile",
              variant: "destructive",
            });
          },
        }
      );
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "All password fields are required",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
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
            title: "Success",
            description: "Password updated successfully",
          });
        },
      }
    );
  };

  const handleEmailUpdate = () => {
    changeEmail(
      { email: formEmail },
      {
        onSuccess: () => {
          setDisplayEmail(formEmail);
          setIsEmailVerified(false); // Set email as unverified when changed
          toast({
            title: "Success",
            description: "Email updated successfully. Please verify your new email address.",
          });
        },
      }
    );
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto h-svh space-y-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={displayImage} alt={displayName} />
              <AvatarFallback>
                {displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{displayName}</h2>
              <p className="text-muted-foreground">
                {displayEmail}{" "}
                {isEmailVerified ? (
                  <span className="text-green-600">(Verified)</span>
                ) : (
                  <span className="text-red-600">(Not Verified)</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileImage">Profile Picture</Label>
                  <Input
                    id="profileImage"
                    type="file"
                    onChange={handleProfileImageChange}
                    accept="image/*"
                  />
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button disabled={isUpdateProfilePending}>
                      {isUpdateProfilePending && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Personal Info
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Update Profile</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to update your profile information?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handlePersonalUpdate}>
                        Update
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Password
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Change Password</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to change your password?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handlePasswordUpdate}>
                        Update
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" disabled={isPending}>
                      {isPending && (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Email
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Update Email</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to update your email address? You will need to verify your new email.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleEmailUpdate}>
                        Update
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {!isEmailVerified && (
                  <div className="mt-4">
                    <Alert>
                      <AlertTitle>Email not verified</AlertTitle>
                      <AlertDescription>
                        Please verify your email address to access all features.
                      </AlertDescription>
                    </Alert>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="mt-2 w-full">
                          Resend Verification Email
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Resend Verification Email</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to resend the verification email?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>
                            Send Email
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditProfileForm;