# 1. Node 20 이미지를 기반으로 사용
FROM node:20

# 2. 작업 디렉토리 생성 및 지정
WORKDIR /app

# 3. package.json과 package-lock.json 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 소스 코드 복사
COPY . .

# 6. Vite dev server 실행
CMD ["npm", "run", "dev", "--", "--host"]

# 7. Vite dev server 포트 노출
EXPOSE 5173