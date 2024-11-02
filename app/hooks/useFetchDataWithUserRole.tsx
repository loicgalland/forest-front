import { useEffect } from "react";
import AuthRepository from "@/app/repository/AuthRepository";
import { useAuth } from "@/app/services/AuthContext";

const useFetchDataWithUserRole = (
  fetchDataArray: ((role: string) => Promise<void>)[],
) => {
  const { userRole, setUserRole } = useAuth();
  const { setUserId } = useAuth();

  useEffect(() => {
    const getUserRoleAndFetchData = async () => {
      const response = await AuthRepository.getUserRole();
      const role = response.data.role;
      const id = response.data.id;
      setUserRole(role);
      setUserId(id);

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
