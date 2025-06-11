# 1. Node.js 20 이미지에서 시작
FROM node:20

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json, package-lock.json 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 소스 코드 복사
COPY . .

# 6. 빌드 실행
RUN npm run build

# 7. production 환경에서 serve 설치 (간단히 빌드 결과만)
RUN npm install -g serve

# 8. 컨테이너가 시작할 때 dist 폴더 내 정적 파일을 serve로 서빙
CMD ["serve", "-s", "dist", "-l", "3000"]

# 9. 컨테이너 외부와 통신할 포트 노출
EXPOSE 3000