import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-bg-primary text-label-primary">
      <p className="text-large-title font-semibold">Contour</p>
      <p className="text-body text-label-secondary">
        Phase 0 infrastructure is set up.
      </p>
      <Link href="/docs">
        <Button leadingIcon="chevron-right">Go to Docs</Button>
      </Link>

      <Container>
        <Grid
          columns={{ compact: 1, regular: 2 }}
          gap="3"
          className="items-start p-(--space-4)"
          container={false}
        >
          <Card elevation="flat" padding="4" role="button" tabIndex={0}>
            <VStack gap="1" container={false}>
              <Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
                inventore, cumque iste voluptatum deleniti amet enim ipsa sequi
                possimus vel iusto sint voluptatibus hic saepe magni esse
                accusamus rerum! Dolore!ß
              </Text>
              <div className="mt-(--space-1) flex h-16 w-full items-center justify-center rounded-sm bg-fill-secondary">
                <Icon name="image" size="md" className="text-label-tertiary" />
              </div>
            </VStack>
          </Card>
          <Card elevation="flat" padding="4" role="button" tabIndex={0}>
            <VStack gap="1" container={false}>
              <Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
                inventore, cumque iste voluptatum deleniti amet enim ipsa sequi
                possimus vel iusto sint voluptatibus hic saepe magni esse
                accusamus rerum! Dolore!ß
              </Text>
              <div className="mt-(--space-1) flex h-16 w-full items-center justify-center rounded-sm bg-fill-secondary">
                <Icon name="image" size="md" className="text-label-tertiary" />
              </div>
            </VStack>

            <Grid
              columns="auto-fit"
              minItemWidth="md"
              gap="3"
              className="items-start p-(--space-4)"
            >
              <Card elevation="flat" padding="4" role="button" tabIndex={0}>
                <VStack gap="1" container={false}>
                  <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolores inventore, cumque iste voluptatum deleniti amet
                    enim ipsa sequi possimus vel iusto sint voluptatibus hic
                    saepe magni esse accusamus rerum! Dolore!ß
                  </Text>
                  <div className="mt-(--space-1) flex h-16 w-full items-center justify-center rounded-sm bg-fill-secondary">
                    <Icon
                      name="image"
                      size="md"
                      className="text-label-tertiary"
                    />
                  </div>
                </VStack>
              </Card>
              <Card elevation="flat" padding="4" role="button" tabIndex={0}>
                <VStack gap="1" container={false}>
                  <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolores inventore, cumque iste voluptatum deleniti amet
                    enim ipsa sequi possimus vel iusto sint voluptatibus hic
                    saepe magni esse accusamus rerum! Dolore!ß
                  </Text>
                  <div className="mt-(--space-1) flex h-16 w-full items-center justify-center rounded-sm bg-fill-secondary">
                    <Icon
                      name="image"
                      size="md"
                      className="text-label-tertiary"
                    />
                  </div>
                </VStack>
              </Card>
            </Grid>
          </Card>
        </Grid>
      </Container>
    </main>
  );
}
