const fs = require('fs');
const path = require('path');

const moduleMapping = {
  'projects': 'projects',
  'project-members': 'project_members',
  'training': 'training',
  'research': 'research',
  'events': 'events',
  'submissions': 'submissions',
  'partnerships': 'partnerships',
  'messages': 'messages',
  'team': 'team',
  'media': 'media',
  'settings': 'settings',
  'users': 'users'
};

const adminPagesDir = 'd:/JANIC/app/admin';
Object.keys(moduleMapping).forEach(dir => {
  const p = path.join(adminPagesDir, dir, 'page.tsx');
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    const newCap = moduleMapping[dir] + ':read';
    content = content.replace(/await requireAuth\(null,\s*"[^"]+"\);/, 'await requireAuth(null, "' + newCap + '");');
    fs.writeFileSync(p, content);
    console.log('Updated page ' + p);
  }
});

// Update API routes
const apiDir = 'd:/JANIC/app/api';
Object.keys(moduleMapping).forEach(dir => {
  const routePaths = [
    path.join(apiDir, dir, 'route.ts'),
    path.join(apiDir, dir, '[id]', 'route.ts')
  ];

  routePaths.forEach(p => {
    if (fs.existsSync(p)) {
      let content = fs.readFileSync(p, 'utf8');
      
      content = content.replace(/await requireAuth\(\[[^\]]+\],\s*"[^"]+"\)/g, (match) => {
        // Find if it's GET, POST, PATCH, DELETE context? Hard to know exactly without AST, but we can assume:
        // By default we'll change it to module:update or module:create based on the method if possible.
        // Actually, let's just make it module:manage temporarily, or we can use regex to replace all:
        return 'await requireAuth(null, "' + moduleMapping[dir] + ':update")';
      });

      content = content.replace(/await requireAuth\(null,\s*"[^"]+"\)/g, 'await requireAuth(null, "' + moduleMapping[dir] + ':update")');
      
      fs.writeFileSync(p, content);
      console.log('Updated API ' + p);
    }
  });
});
