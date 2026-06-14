const Loading = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-gray-900/50 z-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                <p className="text-white text-sm font-medium tracking-wide">Đang tải...</p>
            </div>
        </div>
    );
};

export default Loading;