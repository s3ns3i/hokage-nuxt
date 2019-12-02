// If it's a private page and there's no payload, redirect.
export default function (context) {
  const { store, redirect, route } = context
  const { auth } = store.state


  if (!auth.publicPages.includes(route.name) && !auth.payload) {
    const users = store.dispatch("users/find");
    if (!users.length) {
      return redirect('/first-user')
    } else {
      return redirect('/login')
    }
  }
}
