export default context => {
  const isDarkTheme = localStorage.getItem("hokage_theme_dark");
  context.app.vuetify.framework.theme.isDark = isDarkTheme === "true";
};
