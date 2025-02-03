"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "./icons";
import useUpdateProfile from "@/hooks/api/account/useUpdateProfile";

const EditProfileForm: React.FC = () => {
  const { data: session, status, update: sessionUpdate } = useSession();
  const updateProfileMutation = useUpdateProfile();

  // Gunakan state dengan tipe data yang sesuai
  const [name, setName] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>(
    "/images/placeholder.png",
  );
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setProfileImage(
        session.user.imageUrl ||
          session.user.image ||
          "/images/placeholder.png",
      );
      setIsEmailVerified(session.user.isVerified || false);
    }
  }, [session]);

  if (status === "loading") return <div>Loading session...</div>;
  if (!session) return <div>Please log in to update your profile.</div>;

  const handlePersonalUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate(
      {
        name: name.trim(),
        imageFile: profileFile,
      },
      {
        onSuccess: (response) => {
          if (response.data) {
            toast({
              title: "Success",
              description: response.message,
            });

            // Update local state
            setName(response.data.name);
            setProfileImage(response.data.imageUrl);
            setIsEmailVerified(response.data.isVerified);

            // Update session jika tersedia
            if (sessionUpdate) {
              sessionUpdate({
                ...session,
                user: {
                  ...session.user,
                  name: response.data.name,
                  image: response.data.imageUrl,
                  imageUrl: response.data.imageUrl,
                  isVerified: response.data.isVerified,
                },
              });
            }
          }
        },
      },
    );
  };

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a valid image file",
          variant: "destructive",
        });
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Image size should not exceed 5MB",
          variant: "destructive",
        });
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setProfileFile(file);
    }
  };

  const handlePasswordUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implementasi nanti
  };

  const handleEmailUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implementasi nanti
  };

  const handleResendVerification = async () => {
    // Implementasi nanti
  };

  return (
    <div className="container mx-auto space-y-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileImage} alt={name} />
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="text-muted-foreground">
                {email}{" "}
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
              <form onSubmit={handlePersonalUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Personal Info
                </Button>
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
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button type="submit">Update Password</Button>
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
              <form onSubmit={handleEmailUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit">Update Email</Button>
              </form>
              {!isEmailVerified && (
                <div className="mt-4">
                  <Alert>
                    <AlertTitle>Email not verified</AlertTitle>
                    <AlertDescription>
                      Please verify your email address to access all features.
                    </AlertDescription>
                  </Alert>
                  <Button
                    variant="outline"
                    onClick={handleResendVerification}
                    className="mt-2"
                  >
                    Resend Verification Email
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditProfileForm;
