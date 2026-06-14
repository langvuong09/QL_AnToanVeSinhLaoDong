import InputLegend from "./InputLegend";
import Button from "./ui/Button";

type ChangeEmailProps = {
    email: string;
}

const ChangeEmail = ({ email }: ChangeEmailProps) => {
    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-gray-900/50 z-100 flex items-center justify-center">
            <div className="p-5 bg-white space-y-5">
                <div className="text-center space-y-2">
                    <h1 className="text-xl text-blue-600 font-semibold">THAY ĐỔI EMAIL</h1>
                    <p className="text-sm">
                        Chúng tôi đã gửi mã xác minh qua số email cũ
                        <br />
                        <strong>{email}</strong>
                    </p>
                    <p className="text-sm">Bạn vui lòng kiểm tra và điền mã xác thực</p>
                </div>

                <div>
                    <InputLegend
                        label="OPT"
                        require={true}
                        input={{}}
                    />

                    <div>
                        {/*  */}

                        <div>
                            <span>Chưa nhận được mã ?</span>
                            <button>Gửi lại</button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <Button variant="primary">
                        Xác nhận
                    </Button>

                    <Button variant="outline">
                        Hủy bỏ
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ChangeEmail;