export function createTable({ headers, rows, actions = true }) {
  return `
    <div class="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:border-b">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              ${headers.map(header => `
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  ${header}
                </th>
              `).join('')}
              ${actions ? `
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              ` : ''}
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}