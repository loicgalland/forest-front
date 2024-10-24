import { useEffect } from "react";
import AuthRepository from "@/app/repository/AuthRepository";
import { useAuth } from "@/app/services/AuthContext";

const useGetUserRole = () => {
  const { userRole, setUserRole } = useAuth();

  useEffect(() => {
    const getUserRole = async () => {
      const response = await AuthRepository.getUserRole();
      setUserRole(response.data.roleole);
    };

    if (!userRole) getUserRole();
  }, [userRole]);
};

export default useGetUserRole;
