/* eslint-disable */
const { execSync } = require('child_process');

const password = '8vy*h81}Z*[02m#xJOcu#WIH';
const encodedPassword = encodeURIComponent(password);
const databaseUrl = `postgresql://wedding_user:${encodedPassword}@localhost:5433/wedding_planner`;

console.log('Running migration...');
try {
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  });
  console.log('Migration successful');
} catch (error) {
  console.error('Migration failed');
  process.exit(1);
}
