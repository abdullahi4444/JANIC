import type { TeamMember } from "@prisma/client";

export interface ProjectTeamMember {
  name: string;
  role: string | null;
}

export interface EnrichedProjectTeamMember extends ProjectTeamMember {
  profile: TeamMember | undefined;
}

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/^(eng\.?|dr\.?|prof\.?|mr\.?|ms\.?|mrs\.?)\s+/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function parseProjectTeam(teamMembers?: string | null): ProjectTeamMember[] {
  if (!teamMembers) return [];

  return teamMembers
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(.+?)\s*(?:\((.+?)\))?$/);
      return {
        name: match?.[1]?.trim() ?? entry,
        role: match?.[2]?.trim() ?? null,
      };
    });
}

export function enrichProjectTeam(
  teamMembers: ProjectTeamMember[],
  profiles: TeamMember[]
): EnrichedProjectTeamMember[] {
  return teamMembers.map((member) => {
    const canonical = normalizeName(member.name);

    const profile = profiles.find((candidate) => {
      const candidateName = normalizeName(candidate.name);
      return (
        candidateName === canonical ||
        candidateName.includes(canonical) ||
        canonical.includes(candidateName)
      );
    });

    return {
      ...member,
      role: member.role ?? profile?.role ?? null,
      profile,
    };
  });
}
