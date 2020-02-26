// If it's a private page and there's no payload, redirect.
export default async function (context) {
  const { store, redirect, route } = context
  const { auth } = store.state

  if (!auth.accessToken) {
    console.log('no token!')
    const { total } = await store.dispatch("first-user/find");
    if (!total) {
      return redirect('/first-user')
    }
    if (route.name === 'first-user') {
      return redirect('/login')
    }
    // If user is not logged in and tries to access the main page
    // If user is not logged in and tries to access restricted resource
    if (!auth.publicPages.includes(route.name) || route.name === '/') {
      console.log('redirecting to login');
      return redirect('/login')
    }
    console.log(`somehow it passed security: ${route.name}`)
  } else {
    if (route.name === 'first-user') {
      return redirect('/')
    }
    if (route.name === 'login') {
      return redirect('/')
    }
  }
}
