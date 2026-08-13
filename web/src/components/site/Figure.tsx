import { siteImageWithAlt } from '@/components/site/media'
import { Plate, PLATE_SIZES, type PlateProps } from '@/components/site/Plate'
import { MediaImage } from '@/components/ui/Media'
import { cn } from '@/lib/cn'

type FigureProps = PlateProps & { file: string; alt?: string }

export async function Figure({ file, alt, ...plate }: FigureProps) {
  return <Plate media={await siteImageWithAlt(file, alt)} {...plate} />
}

export function Mark(props: Omit<FigureProps, 'size'>) {
  return <Figure {...props} size="mark" />
}

export async function Photo({
  file,
  alt,
  sizes = PLATE_SIZES,
  priority = false,
  className,
}: {
  file: string
  alt?: string
  sizes?: string
  priority?: boolean
  className?: string
}) {
  return (
    <MediaImage
      media={await siteImageWithAlt(file, alt)}
      sizes={sizes}
      priority={priority}
      className={cn('rounded-lg', className)}
    />
  )
}
