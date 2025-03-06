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
import useChangePassword from "@/hooks/api/account/useChangePassword";
import { useChangeEmail } from "@/hooks/api/account/useChangeEmail";
import useGetTenant from "@/hooks/api/account/useGetTenant";

import {
  CheckCircle,
  AlertCircle,
  Camera,
  Mail,
  Lock,
  Building,
  Phone,
  CreditCard,
  Ban,
} from "lucide-react";
import { useUpdateTenant } from "@/hooks/api/account/useUpdateTenant";

const EditProfileForm = () => {
  const { data: session, status } = useSession();
  const changePasswordMutation = useChangePassword();
  const { mutate: changeEmail, isPending } = useChangeEmail();

  const { data: tenant, isLoading: isTenantLoading } = useGetTenant();
  const { mutate: updateTenant, isPending: isUpdateTenantPending } =
    useUpdateTenant();
  const [displayName, setDisplayName] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [formEmail, setFormEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [tenantName, setTenantName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankNumber, setBankNumber] = useState("");
  const [tenantImageFile, setTenantImageFile] = useState<File | null>(null);
  const [tenantPreviewImage, setTenantPreviewImage] = useState<string | null>(
    null,
  );
  const [tenantImage, setTenantImage] = useState("/images/placeholder.png");

  useEffect(() => {
    if (session?.user) {
      setDisplayEmail(session.user.email || "");
      setFormEmail(session.user.email || "");
      setIsEmailVerified(session.user.isVerified || false);
    }
  }, [session]);

  useEffect(() => {
    if (tenant) {
      setTenantName(tenant.name || "");
      setDisplayName(tenant.name || "");
      setPhoneNumber(tenant.phoneNumber || "");
      setBankName(tenant.bankName || "");
      setBankNumber(tenant.bankNumber || "");
      setTenantImage(tenant.imageUrl || "/images/placeholder.png");
    }
  }, [tenant]);

  if (status === "loading" || isTenantLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
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
              <Button className="mt-4" variant="default">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const handleTenantImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTenantImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setTenantPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTenantUpdate = async () => {
    try {
      await updateTenant(
        {
          name: tenantName,
          phoneNumber,
          bankName,
          bankNumber,
          imageFile: tenantImageFile,
        },
        {
          onSuccess: () => {
            setDisplayName(tenantName);
            if (tenantImageFile) {
              setTenantPreviewImage(null);
            }
            toast({
              title: "Tenant Profile Updated",
              description:
                "Your tenant information has been updated successfully.",
            });
          },
          onError: (error) => {
            toast({
              title: "Update Failed",
              description:
                "There was a problem updating your tenant profile. Please try again.",
              variant: "destructive",
            });
          },
        },
      );
    } catch (error) {
      console.error("Error updating tenant profile:", error);
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
                  src={tenantPreviewImage || tenantImage}
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
                htmlFor="tenant-avatar-upload"
                className="absolute bottom-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary/90 sm:bottom-3 sm:right-3 sm:h-10 sm:w-10"
              >
                <Camera size={16} className="sm:size-20" />
                <input
                  id="tenant-avatar-upload"
                  type="file"
                  className="hidden"
                  onChange={handleTenantImageChange}
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

      <Tabs defaultValue="tenant" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 rounded-lg bg-muted/50">
          <TabsTrigger
            value="tenant"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Building size={16} />
            <span className="hidden sm:inline">Tenant Info</span>
            <span className="sm:hidden">Tenant</span>
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
          <TabsContent value="tenant">
            <Card className="border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Tenant Information</CardTitle>
                <CardDescription>
                  Update your tenant profile and business details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="space-y-2">
                    <Label htmlFor="tenantName" className="text-sm font-medium">
                      Business Name
                    </Label>
                    <Input
                      id="tenantName"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium"
                    >
                      <Phone size={16} className="mr-1 inline" />
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                      placeholder="e.g. +62812345678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="text-sm font-medium">
                      <Building size={16} className="mr-1 inline" />
                      Bank Name
                    </Label>
                    <Input
                      id="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                      placeholder="e.g. BCA, Mandiri, BNI"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankNumber" className="text-sm font-medium">
                      <CreditCard size={16} className="mr-1 inline" />
                      Bank Account Number
                    </Label>
                    <Input
                      id="bankNumber"
                      value={bankNumber}
                      onChange={(e) => setBankNumber(e.target.value)}
                      className="border-gray-200 focus-visible:ring-primary"
                      placeholder="Your bank account number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="tenantImage"
                      className="text-sm font-medium"
                    >
                      Business Logo
                    </Label>
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={tenantPreviewImage || tenantImage}
                          alt="Business Logo"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Input
                        id="tenantImage"
                        type="file"
                        onChange={handleTenantImageChange}
                        accept="image/*"
                        className="flex-1 border-gray-200 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          disabled={isUpdateTenantPending}
                          className="mt-2 px-6"
                        >
                          {isUpdateTenantPending && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Save Tenant Information
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Update Tenant Profile
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to update your tenant business
                            information?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-md">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleTenantUpdate}
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
