import os

def resolve_conflicts_keep_head(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs: dirs.remove('node_modules')
        if '.next' in dirs: dirs.remove('.next')
        if '.git' in dirs: dirs.remove('.git')
        
        for file in files:
            if not file.endswith(('.tsx', '.ts', '.js', '.jsx', '.css')): continue
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if '<<<<<<< HEAD' not in content: continue
                
                lines = content.split('\n')
                new_lines = []
                in_head = False
                in_other = False
                for line in lines:
                    if line.startswith('<<<<<<< HEAD'):
                        in_head = True
                        continue
                    elif line.startswith('======='):
                        in_head = False
                        in_other = True
                        continue
                    elif line.startswith('>>>>>>>'):
                        in_other = False
                        continue
                    
                    if in_other:
                        continue
                    new_lines.append(line)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write('\n'.join(new_lines))
                print(f"Resolved: {filepath}")
            except Exception as e:
                print(f"Error on {filepath}: {e}")

resolve_conflicts_keep_head('.')
