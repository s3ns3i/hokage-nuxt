// If it's a private page and there's no payload, redirect.
export default async function (context) {
  const { store, redirect, route } = context
  const { auth } = store.state


  // If any user tries to access this page 
  if (route.name === 'first-user') {
    const usersNo = await store.dispatch("first-use/find");
    if (!usersNo.total) {
      return
    } else {
      return redirect('/login')
    }
  }
  // If user is not logged in and tries to access the main page
  // If user is not logged in and tries to access restricted resource
  if ((!auth.publicPages.includes(route.name) || route.name === '/') && !auth.payload) {
    return redirect('/login')
  }
}
