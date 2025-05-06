import axios from "@/lib/axios";
import LoginRequestDto from "@/dto/auth/request/login-request.dto";
import RegisterRequestDto from "@/dto/auth/request/register-request.dto";
import TokenResponseDto from "@/dto/auth/response/token-response.dto";

export async function login(dto: LoginRequestDto): Promise<TokenResponseDto> {
    return axios.post('/api/auth/login', dto)
        .then((res): TokenResponseDto => {
            const { accessToken, refreshToken } = res.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            return res.data;
        });
}

export async function register(dto: RegisterRequestDto): Promise<TokenResponseDto> {
    return axios.post('/api/auth/register', dto)
        .then((res): TokenResponseDto => {
            const { accessToken, refreshToken } = res.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            return res.data;
        });
}

export async function refreshToken(): Promise<TokenResponseDto> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('리프레시 토큰이 없습니다.');
    }
    
    return axios.post('/api/auth/refresh', null, {
        headers: {
            'Refresh': `Bearer ${refreshToken}`
        }
    }).then((res): TokenResponseDto => {
        const { accessToken, refreshToken } = res.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return res.data;
    });
}

export function logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

export function isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
} 