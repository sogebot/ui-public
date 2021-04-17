export default function () {
  return { x: 0, y: Number(localStorage.getItem('public-scrollY') ?? 0) };
}
