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

# 6. 빌드 (타입스크립트)
RUN npm run build

# 7. 앱 실행
CMD ["node", "dist/index.js"]

# 8. 앱이 사용하는 포트 노출
EXPOSE 8801