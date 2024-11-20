export const Loader = () => {
  return (
    <div className="absolute top-0 left-0 z-20 bg-loader h-full w-full flex items-center justify-center">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      ></div>
    </div>
  );
};
