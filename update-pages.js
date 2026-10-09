const fs = require('fs');
const path = require('path');

const mappings = {
  'projects/page.tsx': 'edit_content',
  'project-members/page.tsx': 'manage_team',
  'training/page.tsx': 'edit_content',
  'research/page.tsx': 'edit_content',
  'events/page.tsx': 'edit_content',
  'submissions/page.tsx': 'review_submissions',
  'partnerships/page.tsx': 'review_submissions',
  'messages/page.tsx': 'review_submissions'
};

Object.entries(mappings).forEach(([file, cap]) => {
  const p = path.join('d:/JANIC/app/admin', file);
  if (!fs.existsSync(p)) return;
  
  let content = fs.readFileSync(p, 'utf8');
  if (content.includes('requireAuth(')) return;
  
  content = content.replace(/import React from [^;]+;/, match => match + '\nimport { requireAuth } from "@/lib/permissions/roles";');
  
  content = content.replace(/export default async function [^()]+\(\) \{/, match => match + '\n  await requireAuth(null, "' + cap + '");');
  
  fs.writeFileSync(p, content);
  console.log('Updated ' + file);
});
