import Link from "next/link";
import type { TalentProfile } from "@/generated/prisma/browser";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routeBuilders } from "@/lib/routes/builders";

export function TalentCard({ talent }: { talent: TalentProfile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <Link href={routeBuilders.talentDetail(talent.id)} className="hover:underline">
            {talent.fullName}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <strong>Primary Skill:</strong> {talent.primarySkill}
        </p>
        <p>
          <strong>Experience:</strong> {talent.yearsOfExperience} years
        </p>
        <p className="text-muted-foreground">{talent.description.slice(0, 120)}...</p>
      </CardContent>
    </Card>
  );
}
