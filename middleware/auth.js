// If it's a private page and there's no payload, redirect.
export default async function (context) {
  const { store, redirect, route } = context
  const { auth } = store.state


  if (!auth.payload) {
    const usersNo = await store.dispatch("first-user/find");
    if (!usersNo.total) {
      return redirect('/first-user')
    }
    if (route.name === 'first-user') {
      return redirect('/login')
    }
    // If user is not logged in and tries to access the main page
    // If user is not logged in and tries to access restricted resource
    if ((!auth.publicPages.includes(route.name) || route.name === '/') && !auth.payload) {
      return redirect('/login')
    }
  } else {
    if (route.name === 'first-user') {
      return redirect('/')
    }
    if (route.name === 'login') {
      return redirect('/')
    }
  }
}
