import { useEffect } from "react";
import AuthRepository from "@/app/repository/AuthRepository";
import { useAuth } from "@/app/services/AuthContext";

const useFetchDataWithUserRole = (
  fetchDataArray: ((role: string) => Promise<void>)[],
) => {
  const { userRole, setUserRole } = useAuth();

  useEffect(() => {
    const getUserRoleAndFetchData = async () => {
      const response = await AuthRepository.getUserRole();
      const role = response.data.role;
      setUserRole(role);

      await Promise.all(fetchDataArray.map((fetchData) => fetchData(role)));
    };

    if (!userRole) {
      getUserRoleAndFetchData();
    } else {
      Promise.all(fetchDataArray.map((fetchData) => fetchData(userRole)));
    }
  }, [userRole]);
};

export default useFetchDataWithUserRole;
