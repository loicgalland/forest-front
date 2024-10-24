import { useEffect } from "react";
import AuthRepository from "@/app/repository/AuthRepository";
import { useAuth } from "@/app/services/AuthContext";

const useFetchDataWithUserRole = (
  fetchData: (role: string) => Promise<void>,
) => {
  const { userRole, setUserRole } = useAuth();

  useEffect(() => {
    const getUserRoleAndFetchData = async () => {
      const response = await AuthRepository.getUserRole();
      const role = response.data.role;
      setUserRole(response.data.role);
      await fetchData(role);
    };

    if (!userRole) {
      getUserRoleAndFetchData();
    } else {
      fetchData(userRole);
    }
  }, [userRole]);
};

export default useFetchDataWithUserRole;
