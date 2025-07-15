import axios from "axios";

export async function fetchData(
  type: "get" | "post" | "put",
  url: string,
  data?: any,
) {
  try {
    const response = await axios({
      method: type,
      url: url,
      data: type !== "get" && data ? data : undefined,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}` || "",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
