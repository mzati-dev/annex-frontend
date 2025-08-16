// // components/FloatingParticles.tsx
// 'use client';

// const FloatingParticles = () => {
//   return (
//     <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
//       {[...Array(30)].map((_, i) => (
//         <div
//           key={i}
//           className="absolute rounded-full bg-blue-400/80 animate-float"
//           style={{
//             width: `${Math.random() * 10 + 5}px`,
//             height: `${Math.random() * 10 + 5}px`,
//             left: `${Math.random() * 100}%`,
//             top: `${Math.random() * 100}%`,
//             animation: `float ${Math.random() * 20 + 10}s linear infinite`,
//             animationDelay: `${Math.random() * 5}s`,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default FloatingParticles;