const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjQxY2U4NzZmN2NmNWY3OTU5MmNhYSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MDE4ODk0MSwiZXhwIjoxNzkwMjc1MzQxfQ.IKZIDG5pzBLedS2WqAfFqoZVA9YXPYEmrZZSNaTpFp0";



const testDashboard = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/admin/dashboard",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const text = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", text);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

testDashboard();