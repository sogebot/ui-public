export default function (to, from, savedPosition) {
  return { x: 0, y: Number(localStorage.getItem('public-scrollY') ?? 0) }
}