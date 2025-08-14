import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useResume } from '../../context/ResumeContext';
import { ExportPDFButton } from '../../components/ExportPDFButton';
import { TemplateId } from '../../services/templates';

// Try to load WebView at runtime to avoid crashing if it's not installed yet.
let WebViewComp: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  WebViewComp = require('react-native-webview').WebView;
} catch (e) {
  WebViewComp = null;
}

// Ensure fixed-size A4-like layout while allowing zoom inside WebView by
// normalizing the meta viewport and injecting a small non-responsive reset.
function enforceFixedViewport(html: string): string {
  if (!html) return html;

  const FIXED_META = '<meta name="viewport" content="width=794, initial-scale=0.5, minimum-scale=0.1, maximum-scale=5, user-scalable=yes" />';
  const FIXED_STYLE = '<style id="fixed-a4-reset">html, body { margin:0; padding:0; background:#f3f3f3; -webkit-text-size-adjust:100%; }</style>';

  // Replace existing viewport meta if present
  let out = html.replace(/<meta[^>]*name=["']viewport["'][^>]*>/i, FIXED_META);

  // If no viewport meta existed, inject one into <head>
  if (!/name=["']viewport["']/i.test(out)) {
    out = out.replace(/<head(\s*)>/i, (m) => `${m}\n${FIXED_META}`);
  }

  // Inject reset style early in <head> (idempotent)
  if (!/id=["']fixed-a4-reset["']/.test(out)) {
    out = out.replace(/<head(\s*)>/i, (m) => `${m}\n${FIXED_STYLE}`);
  }

  return out;
}

export default function PreviewScreen() {
  const { id, template } = useLocalSearchParams();
  const { currentResume, loading, loadResume } = useResume();
  const tpl = (template as TemplateId | undefined);

  // Ensure the resume is loaded when arriving from Home
  useEffect(() => {
    const rid = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
    if (rid) {
      if (!currentResume || currentResume.id !== rid) {
        loadResume(rid);
      }
    }
  }, [id]);

  if (loading || !currentResume) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Render stored SavedResume HTML in a WebView if available
  if (WebViewComp && currentResume?.html) {
    const html = enforceFixedViewport(currentResume.html);
    return (
      <View className="flex-1 bg-white">
        <WebViewComp
          key={(currentResume.updatedAt?.toISOString?.() || '') + ':' + currentResume.id}
          originWhitelist={["*"]}
          source={{ html }}
          style={{ flex: 1 }}
          javaScriptEnabled
          injectedJavaScriptBeforeContentLoaded={`(function(){
            try {
              function preStrip(){
                try { document.designMode = 'off'; } catch(e) {}
              }
              preStrip();
            } catch (e) {}
          })(); true;`}
          injectedJavaScript={`(function(){
            try {
              function stripDoc(doc){
                if(!doc) return;
                doc.querySelectorAll('[contenteditable], [data-rn-edit]')
                  .forEach(function(el){ el.removeAttribute('data-rn-edit'); el.setAttribute('contenteditable','false'); });
                var st = doc.getElementById('rn-edit-focus-style');
                if (st && st.parentNode) st.parentNode.removeChild(st);
                try { document.designMode = 'off'; } catch(e) {}
                doc.body && doc.body.setAttribute && doc.body.setAttribute('contenteditable','false');
                if (!doc.getElementById('rn-preview-readonly-style')) {
                  var css='*{user-select:none;-webkit-user-select:none;-ms-user-select:none} a, button, input, textarea, select, label, [role="button"], [contenteditable]{pointer-events:none !important;}';
                  var s=doc.createElement('style'); s.id='rn-preview-readonly-style'; s.textContent=css; doc.head.appendChild(s);
                }
                Array.prototype.forEach.call(doc.querySelectorAll('input, textarea, select, button'), function(c){ try{ c.setAttribute('disabled','true'); c.setAttribute('readonly','true'); c.blur(); }catch(_){}});
              }
              function strip(){
                stripDoc(document);
                Array.prototype.forEach.call(document.querySelectorAll('iframe'), function(frame){
                  try { stripDoc(frame.contentDocument || frame.contentWindow && frame.contentWindow.document); } catch(_) {}
                });
              }
              strip();
              document.addEventListener('focusin', function(e){ try{ e.target && e.target.blur && e.target.blur(); }catch(_){} e.stopPropagation(); }, true);
              document.addEventListener('keydown', function(e){ e.preventDefault(); e.stopPropagation(); }, true);
              var mo = new MutationObserver(function(){ strip(); });
              mo.observe(document.documentElement, { attributes:true, childList:true, subtree:true, attributeFilter:['contenteditable','data-rn-edit'] });
              Array.prototype.forEach.call(document.querySelectorAll('iframe'), function(frame){
                try { frame.addEventListener('load', function(){ try { stripDoc(frame.contentDocument || frame.contentWindow && frame.contentWindow.document); } catch(_) {} }); } catch(_) {}
              });
            } catch (e) {}
          })(); true;`}
        />
        <View className="border-t border-gray-200 p-4">
          <ExportPDFButton template={tpl} />
        </View>
      </View>
    );
  }

  // Fallback if WebView not available
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="mb-2 text-lg font-semibold">Preview unavailable</Text>
      <Text className="text-center text-gray-600">Install react-native-webview to preview resumes, or try exporting to PDF.</Text>
      <View className="mt-4 w-full px-6">
        <ExportPDFButton template={tpl} />
      </View>
    </View>
  );
}
