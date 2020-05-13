// If it's a private page and there's no payload, redirect.
export default async function(context) {
  const { store, redirect, route } = context;
  const { auth } = store.state;

  if (!auth.accessToken) {
    try {
      await store.dispatch("auth/authenticate");
    } catch (error) {}
  }
  if (!auth.accessToken) {
    let total = 0;
    try {
      const result = await store.dispatch("first-user/find");
      total = result.total;
    } catch (error) {
      total = 0;
    }
    if (!total && route.name !== "first-user") {
      return redirect("/first-user");
    }
    if (total && route.name === "first-user") {
      return redirect("/login");
    }
    // If user is not logged in and tries to access the main page
    // If user is not logged in and tries to access restricted resource
    if (!auth.publicPages.includes(route.name) || route.name === "/") {
      return redirect("/login");
    }
  } else {
    if (route.name === "first-user") {
      return redirect("/translations");
    }
    if (route.name === "login") {
      return redirect("/translations");
    }
    if (route.name === "/" || route.name === "") {
      return redirect("/translations");
    }
  }
}
