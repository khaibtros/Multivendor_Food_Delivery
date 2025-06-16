import { useCreateMyUser } from "@/api/MyUserApi";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { createUser, isLoading, isError } = useCreateMyUser();

  const hasCreatedUser = useRef(false);

  useEffect(() => {
    const createUserAndNavigate = async () => {
      if (user?.sub && user?.email && !hasCreatedUser.current) {
        try {
          await createUser({ auth0Id: user.sub, email: user.email });
          hasCreatedUser.current = true;
          navigate("/user-profile");
        } catch (error) {
          toast.error("Failed to create user account. Please try again.");
          navigate("/");
        }
      } else if (!user?.sub || !user?.email) {
        navigate("/");
      }
    };

    createUserAndNavigate();
  }, [createUser, navigate, user]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Creating your account...</div>;
  }

  if (isError) {
    return <div className="flex items-center justify-center min-h-screen">Error creating account. Please try again.</div>;
  }

  return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
};

export default AuthCallbackPage;
